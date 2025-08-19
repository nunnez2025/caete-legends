import { cardDatabase } from './cards.js';

async function loadExternalScript(sourceUrl) {
	return new Promise((resolve, reject) => {
		const scriptElement = document.createElement('script');
		scriptElement.src = sourceUrl;
		scriptElement.async = true;
		scriptElement.onload = () => resolve();
		scriptElement.onerror = () => reject(new Error(`Falha ao carregar script: ${sourceUrl}`));
		document.head.appendChild(scriptElement);
	});
}

function injectGameShell() {
	const shellHtml = `
	<canvas id="three-canvas"></canvas>
	<div id="floating-texts"></div>
	<div class="absolute inset-0 opacity-20 pointer-events-none">
		<div class="absolute top-10 left-8 text-6xl sm:text-8xl animate-pulse">🏹</div>
		<div class="absolute top-32 right-4 sm:right-16 text-4xl sm:text-6xl animate-bounce">🪶</div>
		<div class="absolute bottom-20 left-4 sm:left-16 text-6xl sm:text-7xl animate-pulse">🌳</div>
		<div class="absolute bottom-32 right-2 sm:right-8 text-3xl sm:text-5xl animate-bounce">🐬</div>
	</div>
	<div class="relative z-10">
		<div class="border-b-4 border-yellow-400 bg-black/95 backdrop-blur-lg shadow-2xl">
			<div class="max-w-7xl mx-auto px-4 py-4">
				<div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-yellow-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse"></div>
						<div>
							<h1 class="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent">CAETÉ LEGENDS</h1>
							<h2 class="text-sm sm:text-xl font-bold text-orange-300">EDIÇÃO BRASILEIRA PRO</h2>
						</div>
					</div>
					<div class="flex items-center space-x-3">
						<div class="text-center bg-gradient-to-br from-green-800 to-emerald-900 p-2 rounded-lg border-2 border-green-400/50">
							<div class="text-sm sm:text-lg font-bold text-green-400" id="playerWins">0</div>
							<div class="text-xs text-green-300">Vitórias</div>
						</div>
						<div class="text-center bg-gradient-to-br from-red-800 to-rose-900 p-2 rounded-lg border-2 border-red-400/50">
							<div class="text-sm sm:text-lg font-bold text-red-400" id="playerLosses">0</div>
							<div class="text-xs text-red-300">Derrotas</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="max-w-7xl mx-auto p-4" id="gameContainer">
			<div id="menuScreen" class="text-center space-y-6">
				<div class="bg-black/80 rounded-3xl p-6 sm:p-12 border-4 border-yellow-400/50 shadow-2xl">
					<h2 class="text-5xl sm:text-6xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-emerald-300 via-yellow-300 to-red-300 bg-clip-text text-transparent animate-pulse">LENDAS DO BRASIL</h2>
					<p class="text-xl sm:text-2xl text-orange-300 mb-6 font-bold">🏹 Edição Brasileira Pro 🏹</p>
				</div>
				<button id="startDuelBtn" class="touch-btn bg-gradient-to-r from-emerald-600 via-yellow-600 to-red-600 hover:from-emerald-700 hover:via-yellow-700 hover:to-red-700 text-white font-black py-4 sm:py-6 px-8 sm:px-12 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-500 btn-3d">
					<span class="text-xl sm:text-2xl">⚔️ INICIAR DUELO ⚔️</span>
				</button>
			</div>
			<div id="duelScreen" class="space-y-4 hidden">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/90 p-4 sm:p-6 rounded-2xl border-4 border-yellow-400/50 shadow-2xl">
					<div class="text-center">
						<div class="bg-green-800/50 p-3 sm:p-4 rounded-xl border border-green-400/50">
							<h4 class="text-base sm:text-lg font-bold text-green-300 mb-2">🏹 VOCÊ</h4>
							<div class="flex justify-center space-x-3">
								<div class="text-center">
									<div class="text-lg sm:text-xl font-bold text-green-400 hp-glow" id="playerLife">8000</div>
									<div class="text-xs sm:text-xs text-green-300">VIDA</div>
								</div>
								<div class="text-center">
									<div class="text-lg sm:text-xl font-bold text-blue-400 mana-glow" id="playerMana">4</div>
									<div class="text-xs sm:text-xs text-blue-300">MANA</div>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center">
						<div class="bg-yellow-800/50 p-3 sm:p-4 rounded-xl border border-yellow-400/50">
							<div class="text-sm sm:text-lg text-yellow-300 font-bold">DUELO CAETÉ</div>
							<div class="text-xs sm:text-sm text-gray-300">Turno <span id="turnCount">1</span></div>
							<div class="text-xs sm:text-sm font-bold" id="turnIndicator">SEU TURNO</div>
						</div>
					</div>
					<div class="text-center">
						<div class="bg-red-800/50 p-3 sm:p-4 rounded-xl border border-red-400/50">
							<h4 class="text-base sm:text-lg font-bold text-red-300 mb-2">👹 INIMIGO</h4>
							<div class="flex justify-center space-x-3">
								<div class="text-center">
									<div class="text-lg sm:text-xl font-bold text-red-400 hp-glow" id="enemyLife">8000</div>
									<div class="text-xs sm:text-xs text-red-300">VIDA</div>
								</div>
								<div class="text-center">
									<div class="text-lg sm:text-xl font-bold text-blue-400 mana-glow" id="enemyMana">4</div>
									<div class="text-xs sm:text-xs text-blue-300">MANA</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="text-center">
					<h4 class="text-lg sm:text-xl font-bold text-red-300 mb-2">👹 CAMPO INIMIGO</h4>
					<div class="grid grid-cols-5 gap-1 sm:gap-3" id="enemyField"></div>
				</div>
				<div class="text-center">
					<h4 class="text-lg sm:text-xl font-bold text-green-300 mb-2">🏹 SEU CAMPO</h4>
					<div class="grid grid-cols-5 gap-1 sm:gap-3" id="playerField"></div>
				</div>
				<div class="bg-black/90 p-3 rounded-xl border-2 border-green-400/50">
					<div class="flex items-center justify-between mb-2">
						<h5 class="text-base sm:text-lg font-bold text-green-300">🃏 SUA MÃO</h5>
						<div class="flex gap-2">
							<button id="battlePhaseBtn" class="touch-btn bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-lg btn-3d text-xs">⚔️ BATALHA</button>
							<button id="endTurnBtn" class="touch-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg btn-3d text-xs">🔄 FIM DO TURNO</button>
						</div>
					</div>
					<div class="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2" id="playerHand"></div>
					<div class="text-[10px] text-gray-300 mt-1 text-left">Dica: arraste monstros para o seu campo. Arraste magias para o campo para ativar.</div>
				</div>
				<div class="bg-black/90 border-2 border-yellow-400/50 h-32 sm:h-48">
					<div class="p-3 h-full">
						<h5 class="text-xs sm:text-sm font-bold text-yellow-300 mb-1">📜 LOG DE BATALHA</h5>
						<div class="space-y-1 h-24 sm:h-32 overflow-y-auto text-xs sm:text-sm" id="battleLog"></div>
					</div>
				</div>
			</div>
			<div id="victoryScreen" class="text-center space-y-6 hidden">
				<div class="bg-black/90 rounded-3xl p-6 sm:p-12 border-4 border-yellow-400 shadow-2xl">
					<div class="text-6xl sm:text-8xl animate-bounce mb-4">🏆</div>
					<h2 class="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent animate-pulse">VITÓRIA ÉPICA!</h2>
					<p class="text-xl sm:text-2xl text-green-300 mb-6 font-bold">🎉 Você dominou as lendas brasileiras! 🎉</p>
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-6">
						<div class="bg-yellow-800/50 p-3 rounded-xl border border-yellow-400/50">
							<div class="text-xl sm:text-2xl font-bold text-yellow-400">VITÓRIA</div>
							<div class="text-sm sm:text-sm text-yellow-300">Épica!</div>
						</div>
						<div class="bg-purple-800/50 p-3 rounded-xl border border-purple-400/50">
							<div class="text-xl sm:text-2xl font-bold text-purple-400" id="victoryStreak">0</div>
							<div class="text-sm sm:text-sm text-purple-300">Sequência</div>
						</div>
						<div class="bg-green-800/50 p-3 rounded-xl border border-green-400/50">
							<div class="text-xl sm:text-2xl font-bold text-green-400" id="victoryTurns">0</div>
							<div class="text-sm sm:text-sm text-green-300">Turnos</div>
						</div>
					</div>
				</div>
				<div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 space-x-0 sm:space-x-4">
					<button id="newDuelBtn" class="touch-btn bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg">⚔️ NOVO DUELO</button>
					<button id="backToMenuBtn1" class="touch-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg">🏠 MENU</button>
				</div>
			</div>
			<div id="defeatScreen" class="text-center space-y-6 hidden">
				<div class="bg-black/90 rounded-3xl p-6 sm:p-12 border-4 border-red-400 shadow-2xl">
					<div class="text-6xl sm:text-8xl animate-pulse mb-4">💀</div>
					<h2 class="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-r from-red-400 to-gray-400 bg-clip-text text-transparent">DERROTA</h2>
					<p class="text-xl sm:text-2xl text-red-300 mb-6 font-bold">⚰️ Os espíritos sombrios prevaleceram... ⚰️</p>
					<div class="bg-gray-8