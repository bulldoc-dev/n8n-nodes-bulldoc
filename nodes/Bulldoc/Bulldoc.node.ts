import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { pdfDescription } from './resources/pdf';
import { taskDescription } from './resources/task';

export class Bulldoc implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Bulldoc.dev',
		name: 'bulldoc',
		icon: 'file:bulldoc.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Bulldoc.dev API',
		defaults: {
			name: 'Bulldoc.dev',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'bulldocApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'PDF',
						value: 'pdf',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'pdf',
			},

			...pdfDescription,
			...taskDescription,
		],
	};
}
