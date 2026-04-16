import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfMerge = {
	operation: ['merge'],
	resource: ['pdf'],
};

export const pdfMergeDescription: INodeProperties[] = [
	{
		displayName:
			'This operation requires at least two binary PDF files and-or document IDs to be provided. You can provide up to 10 files as binary input and up to 10 document IDs.',
		name: 'mergeNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPdfMerge,
			},
		},
	},

	{
		displayName: 'Document IDs',
		name: 'documentIds',
		type: 'fixedCollection',
		placeholder: 'Add Document',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		description: 'Specify up to 10 document IDs to include in the merge',
		displayOptions: {
			show: {
				...showOnlyForPdfMerge,
			},
		},
		options: [
			{
				displayName: 'Documents',
				name: 'documents',
				values: [
					{
						displayName: 'Document',
						name: 'documentId',
						type: 'resourceLocator',
						required: true,
						default: { mode: 'id', value: '' },
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
				],
			},
		],
	},

	{
		displayName: 'Merge Order',
		name: 'mergeOrder',
		type: 'options',
		default: 'files',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPdfMerge,
		},
		routing: {
			send: {
				type: 'body',
				property: 'order',
			},
		},
		options: [
			{
				name: 'Files, Documents',
				value: 'files',
			},
			{
				name: 'Documents, Files',
				value: 'documents',
			},
		],
	},
];
