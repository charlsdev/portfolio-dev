<script lang="ts">
</script>

<footer id="normal-footer" class="no-print">
   Todos los derechos reservados &copy; 2024
</footer>

<button id="footer-button" on:click={() => window.print()} class="no-print">
   <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-printer"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
         d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2"
      /><path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" /><path
         d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z"
      /></svg
   >
</button>

<style>
   @keyframes fadeIn {
      from {
         opacity: 0;
      }
      to {
         opacity: 1;
      }
   }

   @media (min-width: 601px) {
      #normal-footer {
         display: block;
      }

      #footer-button {
         display: none;
      }
   }

   @media (max-width: 600px) {
      #normal-footer {
         display: none;
      }

      #footer-button {
         /* background: #fff; */
         position: fixed;
         border: 1px solid #eee;
         right: 10px;
         bottom: 10px;
         width: 50px;
         height: 50px;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         cursor: pointer;
      }
   }

   footer {
      background: #fdfdfd;
      border-top: 1px solid #eee;
      position: fixed;
      bottom: 0px;
      left: 0px;
      width: 100%;
      padding-block: 8px;
      text-align: center;
      font-size: 0.85rem;

      view-timeline-name: --revealing;
      view-timeline-axis: block;

      animation: linear 0.3s fadeIn;
      animation-timeline: --revealing;
      animation-range: entry 100% cover 10%;
   }
</style>
