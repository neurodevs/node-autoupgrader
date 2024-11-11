import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.NodeAutoupgrader {

	
	export interface SpruceUpgradeFailed {
		
			
			'packagePath': string
	}

	export interface SpruceUpgradeFailedSchema extends SpruceSchema.Schema {
		id: 'spruceUpgradeFailed',
		namespace: 'NodeAutoupgrader',
		name: 'SPRUCE_UPGRADE_FAILED',
		    fields: {
		            /** . */
		            'packagePath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type SpruceUpgradeFailedEntity = SchemaEntity<SpruceErrors.NodeAutoupgrader.SpruceUpgradeFailedSchema>

}




