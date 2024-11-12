import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'uncommittedChanges',
    name: 'UNCOMMITTED_CHANGES',
    fields: {
        packagePaths: {
            type: 'text',
            isArray: true,
            isRequired: true,
        },
    },
})
