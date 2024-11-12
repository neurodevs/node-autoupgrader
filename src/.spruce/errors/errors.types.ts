import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'







export declare namespace SpruceErrors.NodeAutoupgrader {

	
	export interface TscFailed {
		
			
			'packagePath': string
	}

	export interface TscFailedSchema extends SpruceSchema.Schema {
		id: 'tscFailed',
		namespace: 'NodeAutoupgrader',
		name: 'TSC_FAILED',
		    fields: {
		            /** . */
		            'packagePath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type TscFailedEntity = SchemaEntity<SpruceErrors.NodeAutoupgrader.TscFailedSchema>

}


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


export declare namespace SpruceErrors.NodeAutoupgrader {

	
	export interface GitPublishFailed {
		
			
			'packagePath': string
	}

	export interface GitPublishFailedSchema extends SpruceSchema.Schema {
		id: 'gitPublishFailed',
		namespace: 'NodeAutoupgrader',
		name: 'GIT_PUBLISH_FAILED',
		    fields: {
		            /** . */
		            'packagePath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type GitPublishFailedEntity = SchemaEntity<SpruceErrors.NodeAutoupgrader.GitPublishFailedSchema>

}




