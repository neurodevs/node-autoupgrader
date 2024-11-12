import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'npmVersionPatchFailed',
    name: 'NPM_VERSION_PATCH_FAILED',
    fields: {
        packagePath: {
            type: 'text',
            isRequired: true,
        },
    },
})
