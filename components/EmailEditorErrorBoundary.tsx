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
    this.props.onClose();
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center flex-1 bg-stone-50 p-8">
          <p className="text-stone-600">Editör kapatıldı, panele dönülüyor…</p>
        </div>
      );
    }
    return this.props.children;
  }
}
