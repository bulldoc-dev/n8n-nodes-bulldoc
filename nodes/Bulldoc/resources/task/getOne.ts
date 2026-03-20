import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskGetOne = {
	operation: ['getOne'],
	resource: ['task'],
};

export const taskGetOneDescription: INodeProperties[] = [
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		displayOptions: {
			show: {
				...showOnlyForTaskGetOne,
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
];
