import SpruceAutoupgrader from './components/SpruceAutoupgrader'

async function main() {
    const instance = SpruceAutoupgrader.Create()

    await instance.run(['./'])
}

main().catch((err) => {
    console.error(err)
})
