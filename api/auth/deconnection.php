<script>
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = 'loginU.php';
</script>

<?php
// Redirection terminée côté client
exit();
?>