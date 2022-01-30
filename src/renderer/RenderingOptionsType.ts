import Tag from "./nodes/Tag";

export type RenderingOptionsType = {
	tags?: {
		[key: string]: Tag
	},
	hljs?: any,
	katex?: any
};