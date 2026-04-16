import { IExecuteSingleFunctions } from 'n8n-workflow';

export const appendObj2FormData = (
	o: Record<string, unknown>,
	formData: FormData,
	prefix: string = '',
) => {
	for (const k of Object.getOwnPropertyNames(o)) {
		const kk = prefix ? `${prefix}[${k}]` : k;
		if (typeof o[k] == 'object' && o[k] != null)
			appendObj2FormData(o[k] as Record<string, unknown>, formData, kk);
		else formData.append(kk, o[k]);
	}
};

export const appendFiles2FormData = async (
	ctx: IExecuteSingleFunctions,
	formData: FormData,
	fieldName: string,
	maxFilesNum: number,
	minFilesNum: number,
) => {
	const binary = ctx.getInputData().binary;
	if (!binary) {
		if (minFilesNum > 0) throw new Error('No binary files provided');
		else return 0;
	}

	const files = Object.getOwnPropertyNames(binary);
	if (files.length > maxFilesNum) throw new Error(`The maximum number of files is ${maxFilesNum}`);
	if (files.length < minFilesNum) throw new Error(`The minimum number of files is ${minFilesNum}`);

	for (const k of files) {
		const stream = await ctx.helpers.getBinaryStream(binary[k].id!);
		const response = new Response(stream, {
			headers: { 'Content-Type': binary[k].mimeType },
		});
		formData.append(fieldName, await response.blob(), binary[k].fileName);
	}

	return files.length;
};

export const logFormData = (fd: FormData) => {
	// eslint-disable-next-line no-console
	fd.forEach((v, k) => console.log(`${k} = ${v}`));
};
