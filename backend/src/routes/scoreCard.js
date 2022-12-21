import e, { Router } from 'express'
import ScoreCard from '../models/ScoreCard'

const router = Router()

router.get('/cards', async (req, res) => {
    let { type, queryString } = req.query
    // console.log(type)
    // console.log(queryString)
    let cards = (type === 'name') ? await ScoreCard.find({ name: queryString }) :
        await ScoreCard.find({ subject: queryString })
    // console.log(cards)
    if (cards.length > 0) {
        res.json({
            messages: cards.map((card) => {
                return `Found card with ${type}: (${card.name}, ${card.subject}, ${card.score})`
            }),
            cards
        })
    } else {
        res.json({ message: `${type} (${queryString}) not found!` })
    }
})


router.delete('/cards', async (_, res) => {
    try {
        let { deletedCount } = await ScoreCard.deleteMany({})
        res.json({
            message: 'Database cleared'
        })
        console.log('Database cleared')
    } catch (e) {
        throw new Error("DB delete failed")
    }
})

router.post('/card', async (req, res) => {
    let { name, subject, score } = req.body
    let existing = await ScoreCard.findOne({ name, subject })
    console.log(existing)
    try {
        if (existing) {
            console.log(existing.id)
            await existing.updateOne({ name, subject, score })
            res.json({
                message: `Updating (${name}, ${subject}, ${score})`,
                card: { name, subject, score }
            })
        } else {
            let newScoreCard = new ScoreCard({ name, subject, score })
            console.log('Created ScoreCard', newScoreCard)
            let card = await newScoreCard.save()
            res.json({
                message: `Adding (${name}, ${subject}, ${score})`,
                card
            })
        }
    } catch (e) {
        throw new Error("DB add/update failed")
    }
})

export default router