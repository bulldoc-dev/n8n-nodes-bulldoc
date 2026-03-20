import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfGenerate = {
	operation: ['generate'],
	resource: ['pdf'],
};

export const pdfGenerateDescription: INodeProperties[] = [
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		description: 'The tempate to generate from',
		displayOptions: {
			show: {
				...showOnlyForPdfGenerate,
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'templateId',
			},
		},
		modes: [
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: '',
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
		displayName: 'Data',
		name: 'data',
		type: 'json',
		displayOptions: {
			show: {
				...showOnlyForPdfGenerate,
			},
		},
		default: '{}',
		routing: {
			send: {
				type: 'body',
				property: 'data',
			},
		},
		description: 'The data referenced in the template',
	},
];
