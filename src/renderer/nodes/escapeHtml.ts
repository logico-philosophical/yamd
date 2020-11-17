export default function escapeHtml(s: string) {
	return (s + '').replace(/[&<>"']/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;',
		'"': '&quot;', '\'': '&#39;'
	})[m]);
}