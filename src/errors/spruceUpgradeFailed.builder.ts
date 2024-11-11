import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'spruceUpgradeFailed',
    name: 'SPRUCE_UPGRADE_FAILED',
    fields: {
        packagePath: {
            type: 'text',
            isRequired: true,
        },
    },
})
