import { ref } from 'vue';

export function useDialog() {
  const dialog = ref({
    visible: false,
    message: '',
    currentTemplo: null,
  });

  function abrirDialogo(temploOuAviao) {
    dialog.value.visible = true;
    dialog.value.message = 'Deseja entrar?\nE - Sim   ESC - Não';
    dialog.value.currentTemplo = temploOuAviao;
  }

  function fecharDialogo() {
    dialog.value.visible = false;
    dialog.value.message = '';
    dialog.value.currentTemplo = null;
  }

  function processarTecla(e, aviao) {
    if (!dialog.value.visible) return;

    if (e.key === 'e' || e.key === 'E') {
      alert(
        dialog.value.currentTemplo === aviao
          ? 'Você entrou no avião!'
          : 'Você entrou no templo!'
      );
      fecharDialogo();
    } else if (e.key === 'Escape') {
      fecharDialogo();
    }
  }

  return {
    dialog,
    abrirDialogo,
    fecharDialogo,
    processarTecla,
  };
}
