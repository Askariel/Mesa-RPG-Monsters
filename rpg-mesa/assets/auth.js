/**
 * Auth & Storage Utilities for MESA RPG
 */

// Keys for LocalStorage and SessionStorage
const STORAGE_KEYS = {
  USERS: 'rpg_mesa_users',
  CURRENT_USER: 'currentUser',
  SESSIONS: 'rpg_mesa_sessions',
  CHARACTERS: 'rpg_mesa_characters',
  MESA_CONTENT: 'rpg_mesa_content',
  DICE_HISTORY: 'rpg_mesa_dice_history'
};

/**
 * Initialize storage with default admin if users array doesn't exist
 */
function initStorage() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!users) {
    const defaultUsers = [
      {
        id: 'usr_mestre_default',
        login: 'mestre',
        pass: 'mestre123',
        perfil: 'mestre',
        nome: 'Mestre'
      },
      {
        id: 'usr_jogador_default',
        login: 'jogador',
        pass: 'jogador123',
        perfil: 'jogador',
        nome: 'Aventureiro Valente'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  // Initialize sample characters if empty
  if (!localStorage.getItem(STORAGE_KEYS.CHARACTERS)) {
    const defaultChars = [
      {
        id: 'char_1',
        nome: 'Thorne Sombra-da-Noite',
        classe: 'Ladino',
        raca: 'Elfo',
        nivel: 3,
        hpAtual: 24,
        hpMax: 24,
        manaAtual: 10,
        manaMax: 10,
        forca: 10,
        destreza: 18,
        constituicao: 12,
        inteligencia: 14,
        sabedoria: 12,
        carisma: 14,
        jogador: 'jogador',
        avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80',
        notas: 'Furtivo, especialista em armadilhas.'
      },
      {
        id: 'char_2',
        nome: 'Sir Valerius',
        classe: 'Paladino',
        raca: 'Humano',
        nivel: 4,
        hpAtual: 38,
        hpMax: 42,
        manaAtual: 15,
        manaMax: 18,
        forca: 16,
        destreza: 10,
        constituicao: 16,
        inteligencia: 10,
        sabedoria: 14,
        carisma: 16,
        jogador: 'mestre',
        avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
        notas: 'Juramento dos Devotos.'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(defaultChars));
  }

  // Initialize sample sessions if empty
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    const defaultSessions = [
      {
        id: 'sess_1',
        titulo: 'A Tumba dos Reis Esquecidos',
        data: '2026-10-15',
        horario: '19:30',
        descricao: 'Exploração da cripta subterrânea sob o Vale da Névoa.',
        status: 'agendada'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(defaultSessions));
  }

  // Initialize sample mesa content if empty
  if (!localStorage.getItem(STORAGE_KEYS.MESA_CONTENT)) {
    const defaultMesa = [
      {
        id: 'map_1',
        tipo: 'imagem',
        titulo: 'Mapa da Masmorra',
        url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
        visivelJogadores: true
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MESA_CONTENT, JSON.stringify(defaultMesa));
  }
}

/**
 * Returns current logged-in user object or null
 */
function getCurrentUser() {
  const userJson = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error('Error parsing currentUser:', e);
    return null;
  }
}

/**
 * Ensures user is authenticated; redirects to index.html if not.
 * Handles relative path whether called from root or subfolders.
 */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    const isSubdir = window.location.pathname.includes('/sessao/') ||
                     window.location.pathname.includes('/personagens/') ||
                     window.location.pathname.includes('/configuracoes/');
    window.location.href = isSubdir ? '../index.html' : 'index.html';
    return null;
  }
  return user;
}

/**
 * Ensures user has 'mestre' role; redirects if not.
 */
function requireMestre() {
  const user = requireAuth();
  if (!user) return null;
  if (user.perfil !== 'mestre') {
    const isSubdir = window.location.pathname.includes('/sessao/') ||
                     window.location.pathname.includes('/personagens/') ||
                     window.location.pathname.includes('/configuracoes/');
    window.location.href = isSubdir ? '../dashboard.html' : 'dashboard.html';
    return null;
  }
  return user;
}

/**
 * Logs out the user and redirects to login
 */
function logout() {
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  const isSubdir = window.location.pathname.includes('/sessao/') ||
                   window.location.pathname.includes('/personagens/') ||
                   window.location.pathname.includes('/configuracoes/');
  window.location.href = isSubdir ? '../index.html' : 'index.html';
}

/**
 * Users Management
 */
function getUsers() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  } catch (e) {
    return [];
  }
}

function saveUsers(arr) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(arr));
}

/**
 * Sessions Management
 */
function getSessions() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS)) || [];
  } catch (e) {
    return [];
  }
}

function saveSessions(arr) {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(arr));
}

/**
 * Characters Management
 */
function getCharacters() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHARACTERS)) || [];
  } catch (e) {
    return [];
  }
}

function saveCharacters(arr) {
  localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(arr));
}

/**
 * Mesa Content Management
 */
function getMesaContent() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.MESA_CONTENT)) || [];
  } catch (e) {
    return [];
  }
}

function saveMesaContent(arr) {
  localStorage.setItem(STORAGE_KEYS.MESA_CONTENT, JSON.stringify(arr));
}

/**
 * Dice History Management
 */
function getDiceHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.DICE_HISTORY)) || [];
  } catch (e) {
    return [];
  }
}

function saveDiceHistory(arr) {
  localStorage.setItem(STORAGE_KEYS.DICE_HISTORY, JSON.stringify(arr));
}

// Automatically initialize default storage keys on script load
initStorage();
