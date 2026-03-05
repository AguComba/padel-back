import { PORT } from './config/app.config.js'
import {createApp} from "./app.js"

const app = createApp()

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})