import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
import { appendFiles2FormData, appendObj2FormData } from '../../utils';

import { pdfFromTemplateDescription } from './fromTemplate';
import { pdfFillDescription } from './fill';
import { pdfMergeDescription } from './merge';
import { pdfMetaDescription } from './meta';
import { pdfEncryptDescription } from './encrypt';
import { pdfDecryptDescription } from './decrypt';

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
				name: 'Generate PDF From Template',
				value: 'from-template',
				action: 'Generate PDF from a template',
				description: 'Generate PDF from a HTML template',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/pdf/from/template',
					},
				},
			},

			{
				name: 'Fill Out Form',
				value: 'fill',
				action: 'Fill out a form',
				description: 'Fill out a PDF form',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/pdf/fill',
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
						url: '/v1/pdf/merge',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						arrayFormat: 'repeat',
					},
					send: {
						preSend: [
							async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
								const data = new FormData();
								const numFiles = await appendFiles2FormData(this, data, 'files', 10, 0);
								appendObj2FormData(requestOptions.body as Record<string, unknown>, data);

								const documentIds = (
									this.getNodeParameter('documentIds.documents', []) as Array<{
										documentId: { value: string };
									}>
								).map((doc) => doc.documentId.value);
								if (documentIds.length) {
									for (const docId of documentIds) {
										data.append('documentIds', docId);
									}
								}

								if (documentIds.length > 10)
									throw new Error('Not more than 10 document IDs is allowed');
								if (numFiles + documentIds.length < 2)
									throw new Error('At least two files/document IDs are required to merge');

								requestOptions.body = data;
								return requestOptions;
							},
						],
					},
				},
			},

			{
				name: 'Edit PDF Metadata',
				value: 'meta',
				action: 'Edit PDF metadata',
				description: 'Set title, author and other metadata',
				routing: {
					request: {
						method: 'PATCH',
						url: '/v1/pdf/meta',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						arrayFormat: 'repeat',
					},
					send: {
						preSend: [
							async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
								const data = new FormData();
								const useBinary = this.getNodeParameter('binary', false);

								if (useBinary) await appendFiles2FormData(this, data, 'file', 1, 1);
								appendObj2FormData(requestOptions.body as Record<string, unknown>, data);

								const kws = this.getNodeParameter('metadata.keywords', '')
									?.toString()
									.split(',')
									.map((kw) => kw.trim());
								if (kws) {
									for (const kw of kws) {
										data.append('keywords', kw);
									}
								}

								requestOptions.body = data;
								return requestOptions;
							},
						],
					},
				},
			},

			{
				name: 'Encrypt PDF',
				value: 'encrypt',
				action: 'Encrypt PDF',
				description: 'Set password and permissions',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/pdf/encrypt',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						arrayFormat: 'repeat',
					},
					send: {
						preSend: [
							async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
								const data = new FormData();
								const useBinary = this.getNodeParameter('binary', false);

								if (useBinary) await appendFiles2FormData(this, data, 'file', 1, 1);
								appendObj2FormData(requestOptions.body as Record<string, unknown>, data);

								requestOptions.body = data;
								return requestOptions;
							},
						],
					},
				},
			},

			{
				name: 'Decrypt PDF',
				value: 'decrypt',
				action: 'Decrypt PDF',
				description: 'Decrypt a PDF using a password',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/pdf/decrypt',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						arrayFormat: 'repeat',
					},
					send: {
						preSend: [
							async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
								const data = new FormData();
								const useBinary = this.getNodeParameter('binary', false);

								if (useBinary) await appendFiles2FormData(this, data, 'file', 1, 1);
								appendObj2FormData(requestOptions.body as Record<string, unknown>, data);

								requestOptions.body = data;
								return requestOptions;
							},
						],
					},
				},
			},
		],
		default: 'from-template',
	},

	...pdfFromTemplateDescription,
	...pdfFillDescription,
	...pdfMergeDescription,
	...pdfMetaDescription,
	...pdfEncryptDescription,
	...pdfDecryptDescription,

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
];
