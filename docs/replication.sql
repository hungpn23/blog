change master to master_host = 'mysql_master',
master_port = 3306,
master_user = 'root',
master_password = 'password',
master_log_file = 'mysql-bin.000003', 
master_log_pos = 157,
get_master_public_key=1; -- https://stackoverflow.com/questions/69936021/error-002061-authentication-plugin-caching-sha2-password-reported-error-aut