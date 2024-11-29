function hexToRgb(hex: string): { r: number, g: number, b: number } {
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function interpolateColor(color1: string, color2: string, factor: number): string {
	const rgb1 = hexToRgb(color1);
	const rgb2 = hexToRgb(color2);
	const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
	const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
	const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));

	return rgbToHex(r, g, b);
}

export function createColorGradient(startColor: string, endColor: string, steps: number): string[] {
	const gradient = [];
	for (let i = 0; i <= steps; i++) {
		const factor = i / steps;
		const c = interpolateColor(startColor, endColor, factor);
		gradient.push(c);
	}
	return gradient;
}

function adjustColor(color: string, factor: number): string {
	const rgb = hexToRgb(color);

	const r = Math.min(255, Math.max(0, Math.round(rgb.r * factor)));
	const g = Math.min(255, Math.max(0, Math.round(rgb.g * factor)));
	const b = Math.min(255, Math.max(0, Math.round(rgb.b * factor)));

	return rgbToHex(r, g, b);
}

export function lightenColor(color: string, factor: number): string {
	// Factor > 1 will lighten the color
	return adjustColor(color, 1 + factor);
}

export function darkenColor(color: string, factor: number): string {
	// Factor < 1 will darken the color
	return adjustColor(color, 1 - factor);
}

export function createColorGradientFromColor(color: string, steps: number): string[] {
	const lightColor = lightenColor(color, 0.2);
	const darkColor = darkenColor(color, 0.2);
	return createColorGradient(lightColor, darkColor, steps);
}


export const twLinkHoverColor = (type: string) => {
	switch (type) {
		case 'jj':
			return 'hover:text-accent-500'
		case 'twitch':
			return 'hover:text-[#6441A4]'
		case 'youtube':
			return 'hover:text-[#FF0000]'
		case 'bluesky':
			return 'hover:text-[#1E95EF]'
		case 'twitter':
			return 'hover:text-[#1DA1F2]'
		case 'tiktok':
			return 'hover:text-[#69C9D0]'
		case 'instagram':
			return 'hover:text-[#E4405F]'
		case 'discord':
			return 'hover:text-[#5865f2]'
		default:
			return 'hover:text-[#000000]'
	}
}

export const twLinkBGHoverColor = (type: string) => {
	switch (type) {
		case 'jj':
			return 'hover-bg-accent-500/10'
		case 'twitch':
			return 'hover:bg-[#6441A4]/10'
		case 'youtube':
			return 'hover:bg-[#FF0000]/10'
		case 'bluesky':
			return 'hover:bg-[#1E95EF]/10'
		case 'twitter':
			return 'hover:bg-[#1DA1F2]/10'
		case 'tiktok':
			return 'hover:bg-[#69C9D0]/10'
		case 'instagram':
			return 'hover:bg-[#E4405F]/10'
		case 'discord':
			return 'hover:bg-[#5865f2]/10'
		default:
			return 'hover:bg-[#000000]/10'
	}
}
