import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfDecrypt = {
	operation: ['decrypt'],
	resource: ['pdf'],
};

export const pdfDecryptDescription: INodeProperties[] = [
	{
		displayName: 'Document',
		name: 'documentId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'id', value: '' },
		description: 'The document to edit metadata',
		displayOptions: {
			show: {
				...showOnlyForPdfDecrypt,
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
				...showOnlyForPdfDecrypt,
			},
		},
		default: false,
		description:
			'Whether to use the document ID to decrypt an existing document in your account or upload a new file to decrypt',
	},

	{
		displayName: 'Password',
		description: 'Password to decrypt the PDF file',
		name: 'password',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForPdfDecrypt,
			},
		},
		typeOptions: { password: true },
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'password',
			},
		},
	},
];
