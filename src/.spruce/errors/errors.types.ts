import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'








export declare namespace SpruceErrors.NodeAutoupgrader {

	
	export interface TypeValidationFailed {
		
			
			'packagePath': string
	}

	export interface TypeValidationFailedSchema extends SpruceSchema.Schema {
		id: 'typeValidationFailed',
		namespace: 'NodeAutoupgrader',
		name: 'TYPE_VALIDATION_FAILED',
		    fields: {
		            /** . */
		            'packagePath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type TypeValidationFailedEntity = SchemaEntity<SpruceErrors.NodeAutoupgrader.TypeValidationFailedSchema>

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

	
	export interface NpmPublishFailed {
		
			
			'packagePath': string
	}

	export interface NpmPublishFailedSchema extends SpruceSchema.Schema {
		id: 'npmPublishFailed',
		namespace: 'NodeAutoupgrader',
		name: 'NPM_PUBLISH_FAILED',
		    fields: {
		            /** . */
		            'packagePath': {
		                type: 'text',
		                isRequired: true,
		                options: undefined
		            },
		    }
	}

	export type NpmPublishFailedEntity = SchemaEntity<SpruceErrors.NodeAutoupgrader.NpmPublishFailedSchema>

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




