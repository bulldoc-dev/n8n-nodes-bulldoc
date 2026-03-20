import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';

import { pdfGenerateDescription } from './generate';
import { pdfFilloutDescription } from './fillout';
import { pdfMergeDescription } from './merge';

const showOnlyForPdf = {
	resource: ['pdf'],
};

export const pdfDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPdf,
		},
		options: [
			{
				name: 'Generate PDF',
				value: 'generate',
				action: 'Generate PDF',
				description: 'Generate PDF from a template',
				routing: {
					request: {
						method: 'POST',
						url: '/pdf/generate',
					},
				},
			},
			{
				name: 'Fillout Form',
				value: 'fillout',
				action: 'Fill out a form',
				description: 'Fill out a form',
				routing: {
					request: {
						method: 'POST',
						url: '/pdf/fillout',
					},
				},
			},
			{
				name: 'Merge PDFs',
				value: 'merge',
				action: 'Merge PDF files',
				description: 'Merge multiple PDF files into one',
				routing: {
					request: {
						method: 'POST',
						url: '/pdf/merge',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						arrayFormat: 'repeat',
					},
					send: {
						preSend: [
							async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
								const binary = this.getInputData().binary;
								if (!binary) throw new Error('No binary files provided');

								const data = new FormData();

								for (const k of Object.getOwnPropertyNames(binary)) {
									const stream = await this.helpers.getBinaryStream(binary[k].id!);
									const response = new Response(stream, {
										headers: { 'Content-Type': binary[k].mimeType },
									});
									data.append('files', await response.blob(), binary[k].fileName);
								}

								if (data.getAll('files').length < 2)
									throw new Error('Merge requires at least two files as input');

								const appendObj = (o: Record<string, unknown>, prefix: string = '') => {
									for (const k of Object.getOwnPropertyNames(o)) {
										const kk = prefix ? `${prefix}[${k}]` : k;
										if (typeof o[k] == 'object' && o[k] != null)
											appendObj(o[k] as Record<string, unknown>, kk);
										else data.append(kk, o[k]);
									}
								};
								const b = (
									typeof requestOptions.body === 'object' ? requestOptions.body : {}
								) as Record<string, unknown>;
								appendObj(b);

								requestOptions.body = data;

								return requestOptions;
							},
						],
					},
				},
			},
		],
		default: 'generate',
	},

	...pdfGenerateDescription,
	...pdfFilloutDescription,
	...pdfMergeDescription,

	{
		displayName: 'Task Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: showOnlyForPdf,
		},
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'description',
			},
		},
		description: 'Optional description to identify the task',
	},
	{
		displayName: 'Wait for Completion',
		name: 'sync',
		type: 'boolean',
		displayOptions: {
			show: {
				...showOnlyForPdf,
			},
		},
		default: false,
		routing: {
			send: {
				type: 'body',
				property: 'sync',
			},
		},
		description:
			'Whether to wait for the task to complete and return the files. If false, the node will return immediately with the task ID, and you can use a separate node or a webhook to check for task completion and retrieve the files.',
	},

	{
		displayName: 'PDF Metadata',
		name: 'metadata',
		type: 'collection',
		displayOptions: {
			show: {
				...showOnlyForPdf,
			},
		},
		placeholder: 'Add Metadata',
		default: {},
		options: [
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'meta.title',
						propertyInDotNotation: true,
					},
				},
			},
			{
				displayName: 'Author',
				name: 'author',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'meta.author',
						propertyInDotNotation: true,
					},
				},
			},
		],
	},

	{
		displayName: 'PDF Security',
		name: 'security',
		type: 'fixedCollection',
		displayOptions: {
			show: showOnlyForPdf,
		},
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Permissions',
				name: '_permissions',
				// eslint-disable-next-line n8n-nodes-base/node-param-fixed-collection-type-unsorted-items
				values: [
					{
						displayName: 'Annotating',
						name: 'annotating',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Permission to add or modify text annotations',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.annotating',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Content Accessibility',
						name: 'contentAccessibility',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description:
							'Extract text and graphics (in support of accessibility to users with disabilities or for other purposes)',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.contentAccessibility',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Copying',
						name: 'copying',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Copy or otherwise extract text and graphics from document',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.copying',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Document Assembly',
						name: 'documentAssembly',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description:
							'Assemble the document (insert, rotate or delete pages and create bookmarks or thumbnail images)',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.documentAssembly',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Filling Forms',
						name: 'fillingForms',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Fill in existing interactive form fields',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.fillingForms',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Modifying',
						name: 'modifying',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Modify content permission',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.modifying',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Printing',
						name: 'printing',
						type: 'boolean',
						default: false,
						// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
						description: 'Printing Permission',
						routing: {
							send: {
								type: 'body',
								property: 'security.permissions.printing',
								propertyInDotNotation: true,
							},
						},
					},
					{
						displayName: 'Owner Password',
						description: 'Password that provides unlimited access to the encrypted document',
						name: 'ownerPassword',
						type: 'string',
						required: true,
						typeOptions: { password: true },
						default: '',
						routing: {
							send: {
								type: 'body',
								property: 'security.ownerPassword',
								propertyInDotNotation: true,
							},
						},
					},
				],
			},
			{
				displayName: 'User Password',
				name: '_userPassword',
				values: [
					{
						displayName: 'User Password',
						description: 'Password that restricts reader according to the defined permissions',
						name: 'userPassword',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						routing: {
							send: {
								type: 'body',
								property: 'security.userPassword',
								propertyInDotNotation: true,
							},
						},
					},
				],
			},
		],
	},
];
