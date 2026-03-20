import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskGetMany = {
	operation: ['getMany'],
	resource: ['task'],
};

export const taskGetManyDescription: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: '_additional',
		type: 'collection',
		displayOptions: {
			show: {
				...showOnlyForTaskGetMany,
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Task Status',
				name: 'taskStatus',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Pending',
						value: 'pending',
					},
					{
						name: 'Started',
						value: 'started',
					},
					{
						name: 'Finished',
						value: 'finished',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
				],
				default: 'finished',
				routing: {
					send: {
						type: 'query',
						property: 'status',
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 50,
				routing: {
					send: {
						type: 'query',
						property: 'limit',
					},
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				routing: {
					send: {
						type: 'query',
						property: 'offset',
					},
				},
				description: 'Number of results to skip',
			},
		],
	},
];
