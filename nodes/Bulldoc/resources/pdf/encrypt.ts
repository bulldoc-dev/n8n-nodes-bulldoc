import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfEncrypt = {
	operation: ['encrypt'],
	resource: ['pdf'],
};

export const pdfEncryptDescription: INodeProperties[] = [
	{
		displayName: 'Document',
		name: 'documentId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'id', value: '' },
		description: 'The document to edit metadata',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
				binary: [false],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'documentId',
			},
		},
		modes: [
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[a-zA-Z0-9]{5,}$',
							errorMessage: 'Must be a valid ID',
						},
					},
				],
			},
		],
	},
	{
		displayName: 'Use Binary Input',
		name: 'binary',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		description:
			'Whether to use the document ID to encrypt an existing document in your account or upload a new file to encrypt',
	},

	{
		displayName: 'User Password',
		description:
			'Password that is needed to open the document restricted to the defined permissions',
		name: 'userPassword',
		placeholder: 'Optional',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		typeOptions: { password: true },
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'userPassword',
			},
		},
	},
	{
		displayName: 'Owner Password',
		description: 'Password that provides unlimited access to the encrypted document',
		name: 'ownerPassword',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		required: true,
		typeOptions: { password: true },
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'ownerPassword',
			},
		},
	},
	{
		displayName: 'Annotating',
		name: 'annotating',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Permission to add or modify text annotations',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.annotating',
				propertyInDotNotation: true,
			},
		},
	},
	{
		displayName: 'Content Accessibility',
		name: 'contentAccessibility',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description:
			'Extract text and graphics (in support of accessibility to users with disabilities or for other purposes)',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.contentAccessibility',
				propertyInDotNotation: true,
			},
		},
	},
	{
		displayName: 'Copying',
		name: 'copying',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Copy or otherwise extract text and graphics from document',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.copying',
				propertyInDotNotation: true,
			},
		},
	},
	{
		displayName: 'Document Assembly',
		name: 'documentAssembly',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description:
			'Assemble the document (insert, rotate or delete pages and create bookmarks or thumbnail images)',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.documentAssembly',
				propertyInDotNotation: true,
			},
		},
	},
	{
		displayName: 'Filling Forms',
		name: 'fillingForms',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Fill in existing interactive form fields',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.fillingForms',
				propertyInDotNotation: true,
			},
		},
	},
	{
		displayName: 'Modifying',
		name: 'modifying',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Modify content permission',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.modifying',
				propertyInDotNotation: true,
			},
		},
	},
	{
		displayName: 'Printing',
		name: 'printing',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdfEncrypt,
			},
		},
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Printing Permission',
		routing: {
			send: {
				type: 'body',
				property: 'permissions.printing',
				propertyInDotNotation: true,
			},
		},
	},
];
