// Matches any non-empty string of printable ASCII characters (! to ~)
const VALID_ID_REGEX = /^[!-~]+$/;

describe('/api/notes', () => {
    it('creates and retrieves a note', async () => {
        const testNote = {
            title: '1984',
            content: 'In a totalitarian superstate, a man whose job is to rewrite history dares to fall in love and think for himself, risking the wrath of Big Brother.'
        };
        const createRes = await createNote(testNote);
        expect(createRes).toMatchObject({
            success: true,
            id: expect.stringMatching(VALID_ID_REGEX),
        });

        const getRes = await getNote(createRes.id);
        expectValidNoteResponse(getRes, testNote);
    });

    describe('POST /api/notes with invalid payloads', () => {
        it.each([
            ['missing title and content', {}],
            ['missing content', {title: 'De finibus bonorum et malorum'}],
            ['missing title', {content: 'Lorem ipsum dolor sit amet...'}],
            ['empty title and content', {title: '', content: ''}],
        ])('returns 400 when %s', async (description, payload) => {
            const res = await agent.post('/api/notes').send(payload).expect(400);
            expect(res.body).toMatchObject({
                success: false,
                error: expect.any(String),
            });
        });
    });

    it('list all notes created', async () => {
        const testNote1 = {
            title: 'To Kill a Mockingbird',
            content: 'A lawyer in the Depression-era South defends a black man unjustly accused of a crime, teaching his children about prejudice and courage.'
        };
        const testNote2 = {
            title: 'The Hobbit, or There and Back Again',
            content: 'A comfortable, unwilling hobbit is recruited by a wizard and a band of dwarves to help reclaim their mountain home from a fearsome dragon.'
        };
        await createNote(testNote1);
        await createNote(testNote2);

        const listRes = await agent.get('/api/notes').expect(200);

        expect(listRes.body).toMatchObject({
            success: true,
            notes: expect.arrayContaining([expect.objectContaining(testNote1), expect.objectContaining(testNote2)])
        });
        expect(listRes.body.notes).toHaveLength(2);
    });

    it('updates a note just created', async () => {
        const testNote = {
            title: 'Dune',
            content: 'A young nobleman, his family betrayed, must navigate the politics and ecology of a hostile desert planet to avenge his father and control its valuable resource.'
        };
        const {id} = await createNote(testNote);
        const updatedNote = {
            title: 'Pride and Prejudice',
            content: 'The story of Elizabeth Bennet, who deals with issues of manners, upbringing, morality, and marriage in the society of the landed gentry of early 19th-century England.'
        };

        await agent.put(`/api/notes/${id}`).send(updatedNote).expect(204);
        const getRes = await getNote(id);
        expectValidNoteResponse(getRes, updatedNote);
    });

    it('deletes a note just created', async () => {
        const testNote = {
            title: 'Forrest Gump',
            content: 'Life is like a box of chocolates. You never know what you’re gonna get.'
        };
        const {id} = await createNote(testNote);

        await agent.get(`/api/notes/${id}`).expect(200);
        await agent.delete(`/api/notes/${id}`).expect(204);
        await agent.get(`/api/notes/${id}`).expect(404);
        await agent.delete(`/api/notes/${id}`).expect(404);
    });
});

// Helper functions

const createNote = async (payload) => {
    const res = await agent.post('/api/notes').send(payload).expect(201);
    return res.body;
};

const getNote = async (id) => {
    const res = await agent.get(`/api/notes/${id}`).expect(200);
    return res.body;
};

const expectValidNoteResponse = (response, expectedNote) => {
    expect(response).toMatchObject({
        success: true,
        note: expectedNote,
    });
};