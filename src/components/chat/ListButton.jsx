function ListButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full cursor-pointer bg-primary-200/90 py-2 pr-3 pl-3 text-left font-medium
        transition-all duration-150 hover:scale-105 hover:bg-primary-300 hover:pl-5
        hover:font-semibold focus:outline-none rtl:text-right dark:bg-primary-800/50
        dark:hover:bg-primary-700"
    >
      {text}
    </button>
  );
}

export default ListButton;
