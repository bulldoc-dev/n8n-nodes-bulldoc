import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPdfMerge = {
	operation: ['merge'],
	resource: ['pdf'],
};

export const pdfMergeDescription: INodeProperties[] = [
	{
		displayName:
			'This operation requires at least two binary PDF files provided as input. All binary input will be included in merge.',
		name: 'mergeNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPdfMerge,
			},
		},
	},
];
