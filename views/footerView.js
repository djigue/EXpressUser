function showFooter() {
  return ` 
  <footer class="bg-zinc-300 mt-10 p-6">
    <div class="container mx-auto text-center">
      <h5 class="text-xl font-semibold mb-4">Express User</h5>
      <section class="flex flex-col sm:flex-row justify-between items-center">
        <aside class="mb-4 sm:mb-0">
          <a href="Condition.html" target="_blank" class="text-blue-500 hover:text-blue-700">CGV</a>
        </aside>
        <aside class="flex flex-wrap justify-center sm:justify-around space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="https://x.com/" target="_blank">
            <img src="Images/logoX.png" alt="X" class="w-6 h-6 sm:w-8 sm:h-8"/>
          </a> 
          <a href="https://www.facebook.com/" target="_blank">
            <img src="Images/logoFacebook.jpg" alt="Facebook" class="w-6 h-6 sm:w-8 sm:h-8"/>
          </a>
        </aside>
      </section>
    </div>
  </footer>
  </body>
  </html>`;
}

module.exports = showFooter;
