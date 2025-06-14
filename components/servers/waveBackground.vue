<script setup lang="ts">
import { onMounted } from 'vue';
const { $anime } = useNuxtApp();

const waveIntensity = 1.5; // Lower for smoother waves
const animDelay = 5 * 1000;

onMounted(() => {
	document.querySelectorAll<SVGPathElement>('.wave').forEach((wave, idx) => {
		const originalD = wave.getAttribute('d') || '';
		const randomDur = 6000 + Math.random() * 5000;

		function perturbPath(d: string, amount = 20, phase = 0) {
			const actualAmount = amount * waveIntensity;
			let i = 0;
			return d.replace(/,(-?\d+(\.\d+)?)/g, (match, y) => {
				const base = parseFloat(y);
				// Use a sine wave for smooth offset
				const delta = Math.sin(phase + i * 0.7 + idx) * actualAmount;
				i++;
				return ',' + (base + delta).toFixed(2);
			});
		}

		let phase = 0;
		let lastTime = 0;
		function animateWave() {
			const now = Date.now();
			if (now - lastTime < animDelay) {
				requestAnimationFrame(animateWave);

				return;
			}
			lastTime = now;

			phase += 0.5 + Math.random() * 0.5;
			const newD = perturbPath(originalD, 18 + Math.random() * 8, phase);
			const shift = (Math.random() - 0.5) * 24;

			$anime({
				targets: wave,
				d: [{ value: newD }, { value: originalD }],
				translateX: [{ value: shift }, { value: 0 }],
				duration: randomDur,
				easing: 'easeInOutSine',
				direction: 'alternate',
				loop: false,
				complete: () => {
					setTimeout(() => {
						animateWave(); // Wait animDelay ms before starting next animation
					}, animDelay);
				},
			});
		}
		animateWave();
	});
});
</script>

<template>
	<div id="wave-background" class="fixed inset-0 -z-10 w-full h-full pointer-events-none">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			width="3840"
			height="2160"
			preserveAspectRatio="none"
			viewBox="0 0 3840 2160"
			class="w-full h-full"
		>
			<g mask='url("#SvgjsMask1518")' fill="none">
				<rect width="3840" height="2160" x="0" y="0" fill="rgba(65, 71, 103, 1)"></rect>
				<path
					id="wave1"
					class="wave"
					d="M 0,71 C 256,61.8 768,27.8 1280,25 C 1792,22.2 2048,59.2 2560,57 C 3072,54.8 3584,22.6 3840,14L3840 2160L0 2160z"
					fill="rgba(65, 71, 103, 1)"
				></path>
				<path
					id="wave2"
					class="wave"
					d="M 0,107 C 153.6,118.2 460.8,164.6 768,163 C 1075.2,161.4 1228.8,103 1536,99 C 1843.2,95 1996.8,140.6 2304,143 C 2611.2,145.4 2764.8,105.6 3072,111 C 3379.2,116.4 3686.4,158.2 3840,170L3840 2160L0 2160z"
					fill="rgba(61, 66, 97, 1)"
				></path>
				<path
					id="wave3"
					class="wave"
					d="M 0,259 C 128,244 384,186.2 640,184 C 896,181.8 1024,246.2 1280,248 C 1536,249.8 1664,193.2 1920,193 C 2176,192.8 2304,246.2 2560,247 C 2816,247.8 2944,195.6 3200,197 C 3456,198.4 3712,242.6 3840,254L3840 2160L0 2160z"
					fill="rgba(56, 61, 90, 1)"
				></path>
				<path
					id="wave4"
					class="wave"
					d="M 0,288 C 192,299 576,341 960,343 C 1344,345 1536,300.4 1920,298 C 2304,295.6 2496,336.2 2880,331 C 3264,325.8 3648,283.8 3840,272L3840 2160L0 2160z"
					fill="rgba(51, 55, 82, 1)"
				></path>
				<path
					id="wave5"
					class="wave"
					d="M 0,399 C 192,396.2 576,379.2 960,385 C 1344,390.8 1536,429.6 1920,428 C 2304,426.4 2496,382.8 2880,377 C 3264,371.2 3648,394.6 3840,399L3840 2160L0 2160z"
					fill="rgba(46, 49, 73, 1)"
				></path>
				<path
					id="wave6"
					class="wave"
					d="M 0,459 C 192,466.6 576,498.2 960,497 C 1344,495.8 1536,451.2 1920,453 C 2304,454.8 2496,500.8 2880,506 C 3264,511.2 3648,484.4 3840,479L3840 2160L0 2160z"
					fill="rgba(40, 42, 63, 1)"
				></path>
				<path
					id="wave7"
					class="wave"
					d="M 0,588 C 192,578.2 576,538.6 960,539 C 1344,539.4 1536,590.6 1920,590 C 2304,589.4 2496,533.2 2880,536 C 3264,538.8 3648,590.4 3840,604L3840 2160L0 2160z"
					fill="rgba(33, 34, 52, 1)"
				></path>
				<path
					id="wave8"
					class="wave"
					d="M 0,698 C 192,685 576,639.8 960,633 C 1344,626.2 1536,660.6 1920,664 C 2304,667.4 2496,647 2880,650 C 3264,653 3648,673.2 3840,679L3840 2160L0 2160z"
					fill="rgba(25, 26, 40, 1)"
				></path>
				<path
					id="wave9"
					class="wave"
					d="M 0,703 C 192,714.4 576,760.6 960,760 C 1344,759.4 1536,697.6 1920,700 C 2304,702.4 2496,768.6 2880,772 C 3264,775.4 3648,728 3840,717L3840 2160L0 2160z"
					fill="rgba(17, 17, 27, 1)"
				></path>
				<path
					id="wave10"
					class="wave"
					d="M 0,1487 C 96,1497.6 288,1538.2 480,1540 C 672,1541.8 768,1492.4 960,1496 C 1152,1499.6 1248,1559.4 1440,1558 C 1632,1556.6 1728,1492.2 1920,1489 C 2112,1485.8 2208,1542.6 2400,1542 C 2592,1541.4 2688,1483.2 2880,1486 C 3072,1488.8 3168,1558 3360,1556 C 3552,1554 3744,1492 3840,1476L3840 2160L0 2160z"
					fill="rgba(91, 76, 115, 1)"
				></path>
				<path
					id="wave11"
					class="wave"
					d="M 0,1593 C 128,1598.4 384,1621 640,1620 C 896,1619 1024,1584.4 1280,1588 C 1536,1591.6 1664,1636.6 1920,1638 C 2176,1639.4 2304,1599.8 2560,1595 C 2816,1590.2 2944,1613.2 3200,1614 C 3456,1614.8 3712,1602 3840,1599L3840 2160L0 2160z"
					fill="rgba(110, 118, 169, 1)"
				></path>
				<path
					id="wave12"
					class="wave"
					d="M 0,1721 C 192,1706.4 576,1646.6 960,1648 C 1344,1649.4 1536,1722.2 1920,1728 C 2304,1733.8 2496,1683.2 2880,1677 C 3264,1670.8 3648,1693 3840,1697L3840 2160L0 2160z"
					fill="rgba(112, 151, 195, 1)"
				></path>
				<path
					id="wave13"
					class="wave"
					d="M 0,1735 C 256,1746.2 768,1787.2 1280,1791 C 1792,1794.8 2048,1750.8 2560,1754 C 3072,1757.2 3584,1796.4 3840,1807L3840 2160L0 2160z"
					fill="rgba(126, 181, 202, 1)"
				></path>
				<path
					id="wave14"
					class="wave"
					d="M 0,1869 C 128,1864.6 384,1841.8 640,1847 C 896,1852.2 1024,1897.2 1280,1895 C 1536,1892.8 1664,1840 1920,1836 C 2176,1832 2304,1871.4 2560,1875 C 2816,1878.6 2944,1854.8 3200,1854 C 3456,1853.2 3712,1867.6 3840,1871L3840 2160L0 2160z"
					fill="rgba(142, 200, 185, 1)"
				></path>
				<path id="wave15" class="wave" d="M 0,1903 C 384,1919.6 1152,1980 1920,1986 C 2688,1992 3456,1943.6 3840,1933L3840 2160L0 2160z" fill="rgba(185, 210, 181, 1)"></path>
				<path
					id="wave16"
					class="wave"
					d="M 0,2004 C 256,2013.2 768,2047.8 1280,2050 C 1792,2052.2 2048,2011.2 2560,2015 C 3072,2018.8 3584,2058.2 3840,2069L3840 2160L0 2160z"
					fill="rgba(211, 198, 163, 1)"
				></path>
				<path
					id="wave17"
					class="wave"
					d="M 0,2143 C 128,2132.8 384,2094.6 640,2092 C 896,2089.4 1024,2131 1280,2130 C 1536,2129 1664,2087.8 1920,2087 C 2176,2086.2 2304,2127.8 2560,2126 C 2816,2124.2 2944,2071.8 3200,2078 C 3456,2084.2 3712,2141.2 3840,2157L3840 2160L0 2160z"
					fill="rgba(224, 175, 165, 1)"
				></path>
			</g>
			<defs>
				<mask id="SvgjsMask1518">
					<rect width="3840" height="2160" fill="#ffffff"></rect>
				</mask>
			</defs>
		</svg>
	</div>
</template>
