import React, { Component } from 'react';

class ErrorBoundary extends Component {
  
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to the console or send it to an error tracking service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>; // Display a fallback UI when an error occurs
    }

    return this.props.children; // Render the children components if no error occurred
  }
}

export default ErrorBoundary;