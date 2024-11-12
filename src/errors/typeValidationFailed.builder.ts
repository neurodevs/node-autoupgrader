import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'typeValidationFailed',
    name: 'TYPE_VALIDATION_FAILED',
    fields: {
        packagePath: {
            type: 'text',
            isRequired: true,
        },
    },
})
