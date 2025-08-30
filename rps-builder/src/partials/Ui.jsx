
// ---------- Tiny UI primitives (no external deps) ----------
export const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

export const Input = ({ className = "", ...props }) => (
  <input
    className={
      "w-full rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 px-3 py-2 text-sm outline-none " +
      className
    }
    {...props}
  />
);

export const Textarea = ({ className = "", rows = 3, ...props }) => (
  <textarea
    rows={rows}
    className={
      "w-full rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20 px-3 py-2 text-sm outline-none " +
      className
    }
    {...props}
  />
);

export const Button = ({ variant = "solid", className = "", children, ...props }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors";
  const variants = {
    solid: "bg-gray-900 text-white hover:bg-black",
    outline:
      "border border-gray-300 text-gray-800 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card = ({ title, right, children, className = "" }) => (
  <section className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>
    <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
      {right}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </section>
);

export const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-700">
    {children}
  </span>
);
