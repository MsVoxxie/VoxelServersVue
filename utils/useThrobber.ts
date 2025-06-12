import { reactive } from 'vue';

const throbberState = reactive({ value: true });
const minDisplayTime = 500; // ms

export default function useThrobber() {
	const showThrobber = () => (throbberState.value = true);
	const hideThrobber = () => setTimeout(() => (throbberState.value = false), minDisplayTime);
	return { hideThrobber, showThrobber, throbberState };
}
