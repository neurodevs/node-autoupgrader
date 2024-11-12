import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'gitPublishFailed',
    name: 'GIT_PUBLISH_FAILED',
    fields: {
        packagePath: {
            type: 'text',
            isRequired: true,
        },
    },
})
