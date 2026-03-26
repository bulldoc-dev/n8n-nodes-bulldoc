import type { INodeProperties } from 'n8n-workflow';
import { taskGetManyDescription } from './getMany';
import { taskGetOneDescription } from './getOne';

const showOnlyForTasks = {
	resource: ['task'],
};

export const taskDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTasks,
		},
		options: [
			{
				name: 'Get One',
				value: 'getOne',
				action: 'Get one task',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/tasks/{{$parameter.taskId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get tasks',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/tasks',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'tasks',
								},
							},
						],
					},
				},
			},
		],
		default: 'getOne',
	},

	...taskGetOneDescription,
	...taskGetManyDescription,
];
