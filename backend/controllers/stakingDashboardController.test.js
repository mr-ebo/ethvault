const Table = require('cli-table3');

describe('/api/staking-dashboard', () => {
    it('list top 10 stakers', async () => {
        const listTopRes = await agent.get('/api/staking-dashboard/top-stakers').expect(200);

        expect(listTopRes.body.success).toBe(true);
        const rankings = listTopRes.body.rankings;
        expect(rankings).toBeInstanceOf(Array);
        expect(rankings.length).toBeGreaterThan(0);
        expect(rankings.length).toBeLessThanOrEqual(10);

        const table = createRankingsTable(rankings);
        process.stdout.write(table.toString() + '\n');
    });
});

// Helper functions

function createRankingsTable(rankings) {
    const table = new Table({
        head: ['Rank', 'Address', 'Amount Staked', '% of Total'],
        colAligns: ['center', 'left', 'right', 'right'],
    })
    rankings.forEach((ranking, index) => {
        table.push([
            index + 1,
            ranking.address,
            ranking.amount.toFixed(4),
            ranking.percentage.toFixed(2),
        ])
    })
    return table;
}
