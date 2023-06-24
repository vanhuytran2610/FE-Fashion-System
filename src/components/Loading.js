import React from "react";

export function Loading() {
    return(
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="spinner-border" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
    )
}