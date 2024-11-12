import NeurodevsAutoupgrader from './components/NeurodevsAutoupgrader'

async function main() {
    const instance = NeurodevsAutoupgrader.Create()
    await instance.run()
}

main().catch((err) => {
    console.error(err)
})
