// WebTransport bridge for WASM (syscall/js).
// Exposes window.wtBridge with callback hooks and simple send/close methods.
(function () {
  const state = {
    transport: null,
    stream: null,
    writer: null,
    reader: null,
    readLoopAbort: false,
  };

  function resetState() {
    state.transport = null;
    state.stream = null;
    state.writer = null;
    state.reader = null;
    state.readLoopAbort = false;
  }

  async function startReadLoop(reader) {
    while (!state.readLoopAbort) {
      try {
        const { value, done } = await reader.read();
        if (done) {
          if (typeof window.wtBridge.onclose === "function") {
            window.wtBridge.onclose();
          }
          break;
        }
        if (value && value.byteLength && typeof window.wtBridge.onmessage === "function") {
          // Forward Uint8Array to WASM.
          window.wtBridge.onmessage(value);
        }
      } catch (err) {
        if (typeof window.wtBridge.onerror === "function") {
          window.wtBridge.onerror(err);
        } else {
          console.warn("wtBridge read error:", err);
        }
        break;
      }
    }
  }

  window.wtBridge = {
    onopen: null,
    onmessage: null,
    onclose: null,
    onerror: null,

    async connect(url) {
      try {
        if (!("WebTransport" in window)) {
          throw new Error("WebTransport is not supported in this browser.");
        }
        if (state.transport) {
          await this.close();
        }

        const transport = new WebTransport(url);
        state.transport = transport;

        await transport.ready;

        const stream = await transport.createBidirectionalStream();
        state.stream = stream;
        state.writer = stream.writable.getWriter();
        state.reader = stream.readable.getReader();

        if (typeof this.onopen === "function") {
          this.onopen();
        }

        startReadLoop(state.reader);
        return true;
      } catch (err) {
        if (typeof this.onerror === "function") {
          this.onerror(err);
        } else {
          console.warn("wtBridge connect error:", err);
        }
        return false;
      }
    },

    async send(data) {
      try {
        if (!state.writer) {
          throw new Error("WebTransport writer not ready.");
        }
        // data should be Uint8Array from WASM.
        await state.writer.write(data);
        return true;
      } catch (err) {
        if (typeof this.onerror === "function") {
          this.onerror(err);
        } else {
          console.warn("wtBridge send error:", err);
        }
        return false;
      }
    },

    async close() {
      try {
        state.readLoopAbort = true;
        if (state.reader) {
          await state.reader.cancel();
        }
        if (state.writer) {
          await state.writer.close();
        }
        if (state.transport) {
          await state.transport.close();
        }
        resetState();
        if (typeof this.onclose === "function") {
          this.onclose();
        }
      } catch (err) {
        if (typeof this.onerror === "function") {
          this.onerror(err);
        } else {
          console.warn("wtBridge close error:", err);
        }
      }
    },
  };
})();
