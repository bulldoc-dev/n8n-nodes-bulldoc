import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfMeta = {
	operation: ['meta'],
	resource: ['pdf'],
};

export const pdfMetaDescription: INodeProperties[] = [
	{
		displayName: 'Document',
		name: 'documentId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'id', value: '' },
		description: 'The document to edit metadata',
		displayOptions: {
			show: {
				...showOnlyForPdfMeta,
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
				...showOnlyForPdfMeta,
			},
		},
		default: false,
		description:
			'Whether to use the document ID to edit the metadata of an existing document in your account or upload a new file and set the metadata for it',
	},

	{
		displayName: 'PDF Metadata',
		name: 'metadata',
		type: 'collection',
		displayOptions: {
			show: {
				...showOnlyForPdfMeta,
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Author',
				name: 'author',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'author',
					},
				},
			},
			{
				displayName: 'Creation Date',
				name: 'creationDate',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'creationDate',
					},
				},
			},
			{
				displayName: 'Creator',
				name: 'creator',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'creator',
					},
				},
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				description: 'A comma-separated list of keywords',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Modification Date',
				name: 'modificationDate',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'modificationDate',
					},
				},
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'subject',
					},
				},
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'title',
					},
				},
			},
		],
	},
];
