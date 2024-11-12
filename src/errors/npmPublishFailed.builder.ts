import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'npmPublishFailed',
    name: 'NPM_PUBLISH_FAILED',
    fields: {
        packagePath: {
            type: 'text',
            isRequired: true,
        },
    },
})
