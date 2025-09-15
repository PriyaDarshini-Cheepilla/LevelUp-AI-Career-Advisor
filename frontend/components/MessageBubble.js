export default function MessageBubble({ role, content }) {
    return (
      <div className={`mb-4 max-w-[80%] px-5 py-3 rounded-xl whitespace-pre-wrap ${
        role === "user"
          ? "bg-purple-600 text-white self-end"
          : "bg-white bg-opacity-20 text-gray-100 self-start"
      }`}>
        {content}
      </div>
    );
  }
      