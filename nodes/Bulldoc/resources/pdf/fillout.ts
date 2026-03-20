import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfFillout = {
	operation: ['fillout'],
	resource: ['pdf'],
};

export const pdfFilloutDescription: INodeProperties[] = [
	{
		displayName: 'Form',
		name: 'formId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		description: 'The form to fill in',
		displayOptions: {
			show: {
				...showOnlyForPdfFillout,
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'formId',
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
		displayName: 'Field Values',
		name: 'data',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForPdfFillout,
			},
		},
		default: '{}',
		routing: {
			send: {
				type: 'body',
				property: 'data',
			},
		},
		description: 'The values for the form fields',
	},
];
