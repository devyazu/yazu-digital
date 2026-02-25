import React from 'react';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/** Editör unmount/crash olduğunda panele dönmek için */
export class EmailEditorErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {
    // onClose() burada çağrılmıyor; overlay açık kalsın, kullanıcı Geri ile kapatsın
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center flex-1 bg-stone-50 p-8 gap-4">
          <p className="text-stone-600">Editör yüklenirken hata oluştu.</p>
          <button
            type="button"
            onClick={this.props.onClose}
            className="px-4 py-2 bg-stone-700 text-white text-sm font-medium rounded-lg hover:bg-stone-800"
          >
            ← Panele dön
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
