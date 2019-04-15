import fs from 'fs-extra'
import path from 'path'
import mime from 'mime'
import { fixFilePath } from './fixFilePath';

export interface LoadFilesFDResponse {
	fileDescriptor: number
	headers: {
		'content-length': number
		'last-modified': string
		'content-type': string
	}
}

export interface loadFilesDataResponse {
	buffer: Buffer,
	mime: string
}

export const loadFilesFD = (dir: string, prefix: string) =>
	new Promise<Map<string, LoadFilesFDResponse>>((res, rej) => {
		const files = new Map()
		fs.readdir(dir)
			.then(fnames =>
				fnames.forEach(fname => {
					const filePath = path.join(dir, fname)
					const fileDescriptor = fs.openSync(filePath, 'r')
					const stat = fs.fstatSync(fileDescriptor)
					const contentType = mime.getType(filePath)
          
					files.set(`${prefix}/${fname}`, {
						fileDescriptor,
						headers: {
							'content-length': stat.size,
							'last-modified': stat.mtime.toUTCString(),
							'content-type': contentType,
						},
					})
				})
			)
			.then(() => res(files))
			.catch(rej)
	})

export const loadFilesData = (dir: string, prefix: string) => new Promise<Map<string, loadFilesDataResponse>>((res, rej) => {
	const files = new Map()
	fs.readdir(dir)
		.then(names => names.filter(x => x.match(/\..+$/)))
		.then(fnames =>
			fnames.forEach(async fname => {
				const filePath = path.join(dir, fname)
				const contentType = mime.getType(filePath)
				let buffer: Buffer
				try {
					buffer = fs.readFileSync(filePath)
				} catch (err) {
					return
				}
				const key = `${prefix !== "/" ? fixFilePath(prefix) : ''}/${fname}`
				files.set(key, {
					buffer,
					mime: contentType
				})
			})
		)
		.then(() => res(files))
		.catch(rej)
})