import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'tscFailed',
    name: 'TSC_FAILED',
    fields: {
        packagePath: {
            type: 'text',
            isRequired: true,
        },
    },
})
