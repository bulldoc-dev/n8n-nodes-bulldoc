import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BulldocApi implements ICredentialType {
	name = 'bulldocApi';

	displayName = 'Bulldoc.dev API';
	icon = 'file:../nodes/Bulldoc/bulldoc.svg' as Icon;

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-bulldoc?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.bulldoc.dev/',
			url: '/v1/tasks',
		},
	};
}
