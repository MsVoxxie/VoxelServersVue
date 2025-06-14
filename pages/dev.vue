<template>
	<img id="bg" src="/assets/img/bg.png" />
	<div class="crt-overlay min-h-screen flex items-start justify-center">
		<div class="mx-auto w-full max-w-4xl px-4">
			<!-- Header Logo -->
			<div id="logo" class="flex flex-row items-center justify-center space-x-1 py-5">
				<img src="/assets/img/letters/V.png" class="letter" id="logo-v" />
				<img src="/assets/img/letters/O.png" class="letter" id="logo-o" />
				<img src="/assets/img/letters/X.png" class="letter" id="logo-x1" />
				<img src="/assets/img/letters/X.png" class="letter" id="logo-x2" />
				<img src="/assets/img/letters/I.png" class="letter" id="logo-i" />
				<img src="/assets/img/letters/E.png" class="letter" id="logo-e" />
			</div>
			<div class="flex flex-col md:flex-row gap-0 w-full">
				<!-- Main content -->
				<div class="flex-1 p-3">
					<div class="mainbox bg-black/70 border-2 border-gray-600 rounded-md shadow-2xl p-4 mb-6 backdrop-blur-md">
						<h1 class="text-2md font-bold text-[var(--text_col)] drop-shadow">
							<termBlinker text="› Welcome to Voxelservers!" />
						</h1>
						<p class="mb-2 text-slate-100">Hello, and welcome to my home page. It's a big work in progress!</p>
						<p class="mb-4 text-slate-200">I'm a programmer, I love to work on my silly little projects and learn new things. I strive to learn something every day.</p>
						<span class="text-[var(--text_col)] font-pixel">
							<termBlinker text="› Some stuff about me" />
						</span>
						<ul class="list-disc list-inside ml-4 mt-2 space-y-1 text-slate-100">
							<li>I'm from Canada!</li>
							<li>My main programming languages are Javascript and LUA (Unfortunately!).</li>
							<li>I absolutely love programming, It's my relaxer and helps ease my mind.</li>
							<li>I'm fully self-taught, but plan on working towards a formal education in the future.</li>
						</ul>
					</div>
					<div class="box blog bg-black/70 border-2 border-gray-600 rounded-md shadow-xl p-4 mb-6 backdrop-blur-md">
						<h2 class="text-2md text-[var(--text_col)]">
							<termBlinker text="› My Yapping" />
						</h2>
						<span>(coming soon)</span>
					</div>
					<div class="box projects bg-black/70 border-2 border-gray-600 rounded-md shadow-xl p-4 mb-6 backdrop-blur-md">
						<h2 class="inline text-2md font-bold text-[var(--text_col)] drop-shadow">
							<termBlinker text="› My Projects" />
						</h2>
						<a><h3 class="hover:text-[var(--text_col)] transition">Project 1</h3></a>
						<a><h3 class="hover:text-[var(--text_col)] transition">Project 2</h3></a>
						<a><h3 class="hover:text-[var(--text_col)] transition">Project 3</h3></a>
					</div>
					<div class="box terminal bg-black/70 border-2 border-gray-600 rounded-md shadow-xl p-4 backdrop-blur-md">
						<span class="text-2md font-bold text-[var(--text_col)]">
							<termBlinker text="› System Status" />
						</span>
						<br />
						<table class="mt-2 text-sm">
							<tbody>
								<tr id="statuses">
									<td class="pr-8 align-top">
										<span v-for="service in leftServices" :key="service.id" class="block mb-1">
											[<span :id="service.id" :class="service.statusClass + ' font-bold'">{{ service.status }}</span
											>] {{ service.label }}
										</span>
									</td>
									<td class="align-top">
										<span v-for="service in rightServices" :key="service.id" class="block mb-1">
											[<span :id="service.id" :class="service.statusClass + ' font-bold'">{{ service.status }}</span
											>] {{ service.label }}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<!-- Sidebar (Pinboard) -->
				<div class="w-40 p-3">
					<div class="box bg-black/70 border-2 border-gray-600 rounded-md shadow-xl p-4 top-4 backdrop-blur-md" id="linksdiv">
						<div class="flex items-center mb-2">
							<Pin :size="20" class="text-[var(--text_col)] mr-2 inline-block align-middle" />
							<h2 class="text-sm use-p2-font font-bold text-[var(--text_col)]" style="display: inline">Links</h2>
						</div>
						<NuxtLink class="navlink text-[var(--text_col)] hover:underline transition" href="/" id="home-link" :to="`/`">› Home</NuxtLink><br />
						<NuxtLink class="navlink text-[var(--text_col)] hover:underline transition" href="/" id="home-link" :to="`/servers`">› Servers</NuxtLink><br />
						<!-- <a class="navlink text-[var(--text_col)] hover:underline transition" href="/about.html" id="about-link">› About me</a><br /> -->
						<!-- <a class="navlink text-[var(--text_col)] hover:underline transition" href="#">› Blog</a><br /> -->
						<!-- <a class="navlink text-[var(--text_col)] hover:underline transition" href="#">› Guestbook</a><br /> -->
						<a class="navlink text-[var(--text_col)] hover:underline transition" target="_blank" href="https://x.com/MsVoxxie">› Twitter</a><br />
						<a class="navlink text-[var(--text_col)] hover:underline transition" target="_blank" href="https://bsky.app/profile/msvoxxie.bsky.social">› Bluesky</a><br />
						<a class="navlink text-[var(--text_col)] hover:underline transition" target="_blank" href="https://github.com/MsVoxxie">› GitHub</a><br />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Pin } from 'lucide-vue-next';
import termBlinker from '~/components/home/termBlinker.vue';

declare global {
	interface Window {
		_burnoutAssigned?: boolean;
	}
}

const leftServices = [
	{ id: 'service-1', status: ' OK ', statusClass: 'status-ok', label: 'service 1' },
	{ id: 'service-2', status: ' OK ', statusClass: 'status-ok', label: 'service 2' },
	{ id: 'service-3', status: ' OK ', statusClass: 'status-ok', label: 'service 3' },
	{ id: 'service-4', status: ' OK ', statusClass: 'status-ok', label: 'service 4' },
];

const rightServices = [
	{ id: 'service-5', status: ' OK ', statusClass: 'status-ok', label: 'service 5' },
	{ id: 'service-6', status: ' OK ', statusClass: 'status-ok', label: 'service 6' },
	{ id: 'service-7', status: ' OK ', statusClass: 'status-ok', label: 'service 7' },
	{ id: 'service-8', status: ' OK ', statusClass: 'status-ok', label: 'service 8' },
];

// Randomly minor rotation animation for logo letters on page load
onMounted(() => {
	const letters = ['logo-v', 'logo-o', 'logo-x1', 'logo-x2', 'logo-i', 'logo-e'];
	const degrees = 12; // Maximum rotation in degrees
	letters.forEach((id) => {
		const element = document.getElementById(id);
		if (element) {
			const randomAngle = (Math.random() * degrees * 2 - degrees).toFixed(2); // Random angle between -degrees and degrees
			element.style.transform = `rotate(${randomAngle}deg)`;

			// On hover, straighten the letter
			element.addEventListener('mouseenter', () => {
				element.style.transition = 'transform 0.3s ease';
				element.style.transform = 'rotate(0deg)';
			});
			element.addEventListener('mouseleave', () => {
				element.style.transition = 'transform 0.3s ease';
				element.style.transform = `rotate(${randomAngle}deg)`;
			});
		}
	});

	const flicker = (el: HTMLElement) => {
		let flickerCount = 0;
		const maxFlickers = Math.floor(Math.random() * 2) + 12; // 13-16 flickers
		const flickerInterval = setInterval(() => {
			el.style.filter = el.style.filter === 'brightness(0.7)' ? 'brightness(0.9)' : 'brightness(0.7)';
			flickerCount++;
			if (flickerCount > maxFlickers) {
				el.style.filter = 'brightness(0.9)';
				clearInterval(flickerInterval);
				// Wait a long time before next flicker burst
				setTimeout(() => flicker(el), Math.random() * 6000 + 4000); // 4-10s
			}
		}, Math.random() * 10 + 35); // Flicker speed: 35-45
	};

	const firstX = document.getElementById('logo-x1');
	if (firstX) {
		firstX.style.filter = 'brightness(0.9)';
		setTimeout(() => flicker(firstX), Math.random() * 6000 + 4000); // Initial wait
	}
});
</script>
